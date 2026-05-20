import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FormModule,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  NavModule,
  TabsModule,
  ButtonGroupModule,
  ButtonModule,
  DropdownModule,
  ListGroupModule,
  MultiSelectModule,
  SharedModule,
  DatePickerModule,
  DateRangePickerModule,
  TimePickerModule,
  LoadingButtonModule,
  TableModule,
  UtilitiesModule,
  BadgeModule,
  CollapseModule,
  SmartTableModule,
  ProgressModule,
  Tabs2Module,
  CardModule,
  ButtonDirective,
  SmartTableComponent,
  TemplateIdDirective,
  TextColorDirective,
  ModalModule,
  GridModule,
  SpinnerModule,
  ToastModule,
  AlertModule,
} from '@coreui/angular-pro';
import { GlobalobjectService } from '../../../globalobject.service';
import { RolesModel, RolesService } from './roles.service';
import { CookieService } from 'ngx-cookie-service';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    IconModule,
    Tabs2Module,
    CardModule,
    FormsModule,
    CommonModule,
    FormModule,
    ReactiveFormsModule,
    ButtonDirective,
    SmartTableComponent,
    TemplateIdDirective,
    TextColorDirective,
    ToastModule,
    NavModule,
    TabsModule,
    ButtonGroupModule,
    ButtonModule,
    DropdownModule,
    ListGroupModule,
    MultiSelectModule,
    SharedModule,
    DatePickerModule,
    DateRangePickerModule,
    TimePickerModule,
    LoadingButtonModule,
    ModalModule,
    TableModule,
    UtilitiesModule,
    AlertModule,
    BadgeModule,
    CollapseModule,
    GridModule,
    SmartTableModule,
    SpinnerModule,
    ProgressModule,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent implements OnInit {
  constructor(
    private GlobalobjectService: GlobalobjectService,
    public RolesService: RolesService,
    public usersService: UsersService,
    private CookieService: CookieService,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild('editPerm') editPermCtrl?: NgModel;
  @ViewChild('addPerm') addPermCtrl?: NgModel;

  private enforceMultiSelectValue(arr: number[], isAdd: boolean = false) {
    try {
      const ctrl = isAdd ? this.addPermCtrl : this.editPermCtrl;
      if (ctrl && ctrl.control) {
        ctrl.control.setValue(arr);
        this.cdr.detectChanges();
      }
    } catch (e) {
      // swallow
    }
  }

  ButtonLoading: boolean = false;
  RolessData: any = [];
  showToast: boolean = false;
  ToastMessage: string = '';
  ToastColor: string = '';
  Loading = 0;
  public loading = new Array(4);
  customStylesValidated: boolean = false;
  totalCount: any = 'Records Count: 0 | ';
  inprocess: boolean = false;

  details_visible: { [key: string]: boolean } = {};
  public EditUserModalvisible = false;
  public DetailFormOnLoad = false;

  permissionChangeTimer: any = null;
  lastPermissionEvent: any = null;
  permissionIgnoreUntil: number = 0;
  recentRemoved: Map<number, number> = new Map();

  addPermissionIgnoreUntil: number = 0;
  addRecentRemoved: Map<number, number> = new Map();
  AddMenubackup: any;

  public EditRoleModel = {
    RoleName: '',
    IsActive: false,
    Id: 0,
    Client_Id: '',
    DisplayOrder: 0,
    IsReadOnly: false,
    menus: [] as number[],
  };

  RolessColumns = [
    { key: 'RoleName', label: 'Role Name', filter: false, sorter: false },
    { key: 'IsActive', label: 'Status', _style: { width: '12%' }, filter: false, sorter: false },
    { key: 'Actions', _style: { width: '10%' }, filter: false, sorter: false },
  ];

  async ngOnInit() {
    this.RolesService.RolesData.menus = undefined;
    this.AddMenubackup = [];
    this.getRoles();
    this.getAllMenus();
  }

  GetRoleViaID(item: any) {
    this.EditRoleModel = {
      RoleName: item.RoleName,
      IsActive: item.IsActive,
      Id: item.Id,
      Client_Id: this.CookieService.get('Client_Id'),
      DisplayOrder: item.DisplayOrder,
      IsReadOnly: item.IsReadOnly,
      menus: [],
    };
    const body = {
      partner_Id: Number(this.CookieService.get('Client_Id')),
      role_Id: item.Id,
      showAllMenus: false,
    };

    this.RolesService.getMenuByRoleIDAndClientID(body).subscribe((res: any) => {
      this.EditRoleModel.menus =
        res.Data_MenuList
          ?.filter((menu: any) => menu.IsActive === true)
          .map((menu: any) => menu.Id) || [];
      this.EditMenubackup = this.EditRoleModel.menus;
    });
    this.DetailFormOnLoad = false;
  }

  EditMenubackup: any;

  EditRole(RoleName: string, IsActive: boolean) {
    this.loading[0] = setTimeout(() => {
      this.loading[0] = undefined;
    }, 300000);

    const body = {
      RoleName: RoleName,
      Client_Id: this.CookieService.get('Client_Id'),
      DisplayOrder: this.EditRoleModel.DisplayOrder,
      IsActive: IsActive,
      IsReadOnly: this.EditRoleModel.IsReadOnly,
      Id: this.EditRoleModel.Id,
    };

    this.RolesService.updateRoles(body).subscribe(
      (data: any) => {
        if (data && data.IsSuccess === true) {
          this.ToastMessage = 'Role Updated Successfully.';
          this.ToastColor = 'success';
          this.showToast = true;
          this.loading[0] = undefined;

          setTimeout(() => {
            this.showToast = false;
          }, 3000);

          const requestData: { role_Id: number; MenuIDs: number[] } = {
            role_Id: this.EditRoleModel.Id,
            MenuIDs: this.EditRoleModel.menus,
          };

          this.RolesService.assignMenuToRoles(requestData).subscribe((response: any) => {
            if (response.IsSuccess) {
              this.getRoles();
              this.ToastMessage = 'Role Updated Successfully.';
              this.ToastColor = 'success';
              this.showToast = true;
              this.toggleEditRolesModal();
              setTimeout(() => {
                this.showToast = false;
              }, 3000);

              this.RolesService.RolesData = new RolesModel();
              this.customStylesValidated = false;
            }
          });
        } else {
          this.ToastMessage = data && data.Message ? data.Message : 'Failed to update role.';
          this.ToastColor = 'danger';
          this.customStylesValidated = false;
          this.showToast = true;
          this.loading[0] = undefined;
          setTimeout(() => {
            this.showToast = false;
          }, 3000);
        }
      },
      (error: any) => {
        console.error('Error:', error);
        this.ToastMessage = 'An error occurred while updating the role.';
        this.ToastColor = 'danger';
        this.showToast = true;
        this.customStylesValidated = false;
        this.loading[0] = undefined;
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
      }
    );
  }

  toggleEditRolesModal(item?: any) {
    if (item) {
      this.GetRoleViaID(item);
    }
    this.EditUserModalvisible = !this.EditUserModalvisible;
  }

  async getRoles() {
    this.inprocess = true;
    try {
      this.RolesService.GetRoles(this.CookieService.get('Client_Id')).subscribe(
        (data: any) => {
          this.RolessData = Array.isArray(data.Data)
            ? data.Data.map((item: any) => ({
                Id: item.Id,
                RoleName: item.RoleName,
                IsActive: item.IsActive,
                IsReadOnly: item.IsReadOnly,
                Client_Id: item.Client_Id,
                DisplayOrder: item.DisplayOrder,
              }))
            : [];
          this.totalCount = 'Records Count: ' + this.RolessData.length + ' | ';
          this.inprocess = false;
        },
        (error: any) => {
          console.error('Error fetching roles:', error);
          this.RolessData = [];
          this.totalCount = 'Records Count: 0 | ';
        }
      );
    } catch (error) {
      console.error('Unexpected error in getRoles:', error);
      this.RolessData = [];
      this.totalCount = 'Records Count: 0 | ';
    }
  }

  DeleteRoles(item: any) {}

  toggleDetails(item: any) {}

  MenuList: any;
  getAllMenus() {
    this.RolesService.getMenusByUserId().subscribe({
      next: (res: any) => {
        this.MenuList = res.Data.filter((item: any) => item.IsActive == true);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  AddRole(RoleDetailsForm: any) {
    this.customStylesValidated = true;
    if (RoleDetailsForm.invalid) {
      return;
    }
    this.RolesService.RolesData.Client_Id = Number(this.CookieService.get('Client_Id'));
    this.RolesService.RolesData.IsActive = true;
    this.RolesService.RolesData.IsReadOnly = false;
    this.RolesService.RolesData.DisplayOrder = 0;

    this.ButtonLoading = true;
    this.RolesService.addRoles(this.RolesService.RolesData).subscribe({
      next: (res: any) => {
        if (res.IsSuccess) {
          const requestData: { role_Id: number; MenuIDs: number[] } = {
            role_Id: res.Reserved_A,
            MenuIDs: this.RolesService.RolesData.menus,
          };

          this.RolesService.assignMenuToRoles(requestData).subscribe((response: any) => {
            if (response.IsSuccess) {
              this.getRoles();
              this.ToastMessage = 'Role Added Successfully.';
              this.ToastColor = 'success';
              this.showToast = true;

              setTimeout(() => {
                this.showToast = false;
              }, 3000);

              this.RolesService.RolesData = new RolesModel();
              this.customStylesValidated = false;
            }
          });
        } else {
          this.ToastMessage = res.Message;
          this.ToastColor = 'danger';
          this.showToast = true;
          this.customStylesValidated = false;

          setTimeout(() => {
            this.showToast = false;
          }, 3000);
        }
        this.ButtonLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.ButtonLoading = false;
        this.ToastMessage = 'An error occurred while adding the role.';
        this.ToastColor = 'danger';
        this.showToast = true;
        this.customStylesValidated = false;

        setTimeout(() => {
          this.showToast = false;
        }, 3000);
        alert('Error: ' + error.error.message);
      },
    });
  }

  onEditPermissionsChange(event: any) {
    const IGNORE_MS = 300;

    const extractIdsLocal = (arr: any[]): number[] => {
      if (!Array.isArray(arr)) return [];
      return arr
        .map((it) => {
          if (typeof it === 'number') return it;
          if (typeof it === 'string' && it.trim() !== '') return Number(it);
          if (it && typeof it === 'object') {
            if ('Id' in it) return Number(it.Id);
            if ('id' in it) return Number(it.id);
            if ('value' in it && (typeof it.value === 'number' || typeof it.value === 'string')) return Number(it.value);
            if ('value' in it && typeof it.value === 'object') {
              const v = it.value as any;
              if ('Id' in v) return Number(v.Id);
            }
          }
          return NaN;
        })
        .filter((n) => !isNaN(n));
    };

    const now = Date.now();
    const newNums = extractIdsLocal(event);
    const prevNums = Array.isArray(this.EditMenubackup)
      ? this.EditMenubackup.map((v: any) => Number(v)).filter((n: number) => !isNaN(n))
      : [];
    const addedIds = newNums.filter((id) => !prevNums.includes(id));
    const removedIds = prevNums.filter((id: number) => !newNums.includes(id));

    for (const [k, v] of Array.from(this.recentRemoved.entries())) {
      if (v <= now) this.recentRemoved.delete(k);
    }
    for (const rid of removedIds) {
      this.recentRemoved.set(Number(rid), now + IGNORE_MS);
    }

    if (now < this.permissionIgnoreUntil && removedIds.length === 0) {
      if (Array.isArray(this.EditMenubackup)) {
        this.EditRoleModel.menus = this.EditMenubackup.slice();
        this.enforceMultiSelectValue(this.EditRoleModel.menus);
      }
      return;
    }

    this.permissionIgnoreUntil = now + IGNORE_MS;
    this._processPermissionEvent(event);
  }

  onAddPermissionsChange(event: any) {
    const IGNORE_MS = 300;

    const extractIdsLocal = (arr: any[]): number[] => {
      if (!Array.isArray(arr)) return [];
      return arr
        .map((it) => {
          if (typeof it === 'number') return it;
          if (typeof it === 'string' && it.trim() !== '') return Number(it);
          if (it && typeof it === 'object') {
            if ('Id' in it) return Number(it.Id);
            if ('id' in it) return Number(it.id);
            if ('value' in it && (typeof it.value === 'number' || typeof it.value === 'string')) return Number(it.value);
            if ('value' in it && typeof it.value === 'object') {
              const v = it.value as any;
              if ('Id' in v) return Number(v.Id);
            }
          }
          return NaN;
        })
        .filter((n) => !isNaN(n));
    };

    const now = Date.now();
    const newNums = extractIdsLocal(event);
    const prevNums = Array.isArray(this.AddMenubackup)
      ? this.AddMenubackup.map((v: any) => Number(v)).filter((n: number) => !isNaN(n))
      : [];
    const addedIds = newNums.filter((id) => !prevNums.includes(id));
    const removedIds = prevNums.filter((id: number) => !newNums.includes(id));

    for (const [k, v] of Array.from(this.addRecentRemoved.entries())) {
      if (v <= now) this.addRecentRemoved.delete(k);
    }
    for (const rid of removedIds) {
      this.addRecentRemoved.set(Number(rid), now + IGNORE_MS);
    }

    if (now < this.addPermissionIgnoreUntil && removedIds.length === 0) {
      if (Array.isArray(this.AddMenubackup)) {
        this.RolesService.RolesData.menus = this.AddMenubackup.slice();
        this.enforceMultiSelectValue(this.RolesService.RolesData.menus, true);
      }
      return;
    }

    this.addPermissionIgnoreUntil = now + IGNORE_MS;
    this._processAddPermissionEvent(event);
  }

  private _processPermissionEvent(event: any) {
    const extractIds = (arr: any[]): number[] => {
      if (!Array.isArray(arr)) return [];
      return arr
        .map((it) => {
          if (typeof it === 'number') return it;
          if (typeof it === 'string' && it.trim() !== '') return Number(it);
          if (it && typeof it === 'object') {
            if ('Id' in it) return Number(it.Id);
            if ('id' in it) return Number(it.id);
            if ('value' in it) return Number(it.value);
            if ('value' in it && typeof it.value === 'object') {
              const v = it.value as any;
              if ('Id' in v) return Number(v.Id);
            }
          }
          return NaN;
        })
        .filter((n) => !isNaN(n));
    };

    const newSelected = extractIds(event);
    const prevSelected = Array.isArray(this.EditMenubackup) ? this.EditMenubackup.slice() : [];
    const toNums = (arr: any[]) => (Array.isArray(arr) ? arr : []).map((v) => Number(v)).filter((n) => !isNaN(n));
    const newNums = toNums(newSelected);
    const prevNums = toNums(prevSelected);
    const addedIds = newNums.filter((id) => !prevNums.includes(id));
    const removedIds = prevNums.filter((id) => !newNums.includes(id));
    const menuList = Array.isArray(this.MenuList) ? this.MenuList : [];

    const desired = new Set<number>(newNums);
    const removedSet = new Set<number>(removedIds);

    let touchedId: number | null = null;
    let touchedAction: 'added' | 'removed' | null = null;
    if (addedIds.length === 1 && removedIds.length === 0) {
      touchedId = addedIds[0];
      touchedAction = 'added';
    } else if (removedIds.length === 1 && addedIds.length === 0) {
      touchedId = removedIds[0];
      touchedAction = 'removed';
    } else {
      try {
        if (Array.isArray(event) && event.length > 0) {
          const last = event[event.length - 1];
          const ids = extractIds([last]);
          if (ids.length) {
            touchedId = ids[0];
            if (addedIds.includes(touchedId)) touchedAction = 'added';
            else if (removedIds.includes(touchedId)) touchedAction = 'removed';
          }
        }
      } catch (e) {
        touchedId = null;
        touchedAction = null;
      }
    }

    if (touchedId !== null && touchedAction !== null) {
      const touchedMenu = menuList.find((m: any) => Number(m.Id) === Number(touchedId));
      if (touchedMenu) {
        const isParent = Number(touchedMenu.Parent_Id) === 0;

        if (touchedAction === 'added') {
          if (!isParent) {
            const parent = Number(touchedMenu.Parent_Id);
            if (parent && !removedSet.has(parent)) desired.add(parent);
          }

          if (isParent) {
            const children = menuList
              .filter((m: any) => Number(m.Parent_Id) === Number(touchedId) && m.IsActive)
              .sort((a: any, b: any) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));
            if (children.length > 0) {
              const anyChildSelected = children.some((c: any) => desired.has(Number(c.Id)));
              if (!anyChildSelected) {
                const candidate = children.map((c: any) => Number(c.Id)).find((cid) => !removedSet.has(cid));
                if (candidate !== undefined) desired.add(candidate);
              }
            }
          }
        }

        if (touchedAction === 'removed') {
          if (isParent) {
            const children = menuList.filter((m: any) => Number(m.Parent_Id) === Number(touchedId));
            for (const c of children) desired.delete(Number(c.Id));
            desired.delete(Number(touchedId));
          } else {
            desired.delete(Number(touchedId));
            const parent = Number(touchedMenu.Parent_Id);
            if (parent) {
              const siblings = menuList.filter((m: any) => Number(m.Parent_Id) === parent && m.IsActive);
              const anySiblingSelected = siblings.some((s: any) => desired.has(Number(s.Id)));
              if (!anySiblingSelected) desired.delete(parent);
            }
          }
        }
      }
    }

    for (const id of addedIds) {
      if (touchedId !== null && id === touchedId) continue;
      if (removedSet.has(id)) continue;
      const menu = menuList.find((m: any) => Number(m.Id) === Number(id));
      if (!menu) continue;
      const isParent = Number(menu.Parent_Id) === 0;
      if (!isParent) {
        const parent = Number(menu.Parent_Id);
        if (parent && !removedSet.has(parent)) desired.add(parent);
      }
    }

    for (const id of removedIds) {
      if (touchedId !== null && id === touchedId) continue;
      const menu = menuList.find((m: any) => Number(m.Id) === Number(id));
      if (!menu) {
        desired.delete(Number(id));
        continue;
      }
      const isParent = Number(menu.Parent_Id) === 0;
      if (isParent) {
        const children = menuList.filter((m: any) => Number(m.Parent_Id) === Number(id));
        for (const c of children) desired.delete(Number(c.Id));
        desired.delete(Number(id));
      } else {
        desired.delete(Number(id));
        const parent = Number(menu.Parent_Id);
        if (parent) {
          const siblings = menuList.filter((m: any) => Number(m.Parent_Id) === parent && m.IsActive);
          const anySiblingSelected = siblings.some((s: any) => desired.has(Number(s.Id)));
          if (!anySiblingSelected) desired.delete(parent);
        }
      }
    }

    for (const m of menuList) {
      if (Number(m.Parent_Id) === 0) continue;
      const parent = Number(m.Parent_Id);
      if (!desired.has(parent)) desired.delete(Number(m.Id));
    }

    const finalSelected = Array.from(desired.values()).map((n) => Number(n));
    this.EditRoleModel.menus = finalSelected;
    this.EditMenubackup = this.EditRoleModel.menus;
    this.enforceMultiSelectValue(finalSelected);
  }

  private _processAddPermissionEvent(event: any) {
    const extractIds = (arr: any[]): number[] => {
      if (!Array.isArray(arr)) return [];
      return arr
        .map((it) => {
          if (typeof it === 'number') return it;
          if (typeof it === 'string' && it.trim() !== '') return Number(it);
          if (it && typeof it === 'object') {
            if ('Id' in it) return Number(it.Id);
            if ('id' in it) return Number(it.id);
            if ('value' in it) return Number(it.value);
            if ('value' in it && typeof it.value === 'object') {
              const v = it.value as any;
              if ('Id' in v) return Number(v.Id);
            }
          }
          return NaN;
        })
        .filter((n) => !isNaN(n));
    };

    const newSelected = extractIds(event);
    const prevSelected = Array.isArray(this.AddMenubackup) ? this.AddMenubackup.slice() : [];
    const toNums = (arr: any[]) => (Array.isArray(arr) ? arr : []).map((v) => Number(v)).filter((n) => !isNaN(n));
    const newNums = toNums(newSelected);
    const prevNums = toNums(prevSelected);
    const menuList = Array.isArray(this.MenuList) ? this.MenuList : [];

    const isRecentlyRemoved = (id: number) => {
      const t = this.addRecentRemoved.get(Number(id));
      return !!t && t > Date.now();
    };

    const parentGroups = new Map<number, any[]>();
    for (const m of menuList) {
      const pid = Number(m.Parent_Id);
      if (pid === 0) {
        parentGroups.set(Number(m.Id), [m]);
      }
    }
    for (const m of menuList) {
      const pid = Number(m.Parent_Id);
      if (pid === 0) continue;
      if (!parentGroups.has(pid)) parentGroups.set(pid, []);
      parentGroups.get(pid)!.push(m);
    }

    const globalDesired = new Set<number>();

    const findLastEventIdForGroup = (groupIds: Set<number>) => {
      if (!Array.isArray(event)) return null;
      for (let i = event.length - 1; i >= 0; --i) {
        try {
          const ids = extractIds([event[i]]);
          if (ids && ids.length && groupIds.has(Number(ids[0]))) return Number(ids[0]);
        } catch (e) {
          // ignore
        }
      }
      return null;
    };

    for (const [parentId, groupMenus] of parentGroups.entries()) {
      const groupIds = new Set<number>(groupMenus.map((g: any) => Number(g.Id)));
      const groupNew = newNums.filter((id) => groupIds.has(Number(id)));
      const groupPrev = prevNums.filter((id) => groupIds.has(Number(id)));
      const groupAdded = groupNew.filter((id) => !groupPrev.includes(id));
      const groupRemoved = groupPrev.filter((id) => !groupNew.includes(id));

      const groupDesired = new Set<number>(groupNew.map((n) => Number(n)));
      const groupRemovedSet = new Set<number>(groupRemoved.map((n) => Number(n)));

      let touchedId: number | null = null;
      let touchedAction: 'added' | 'removed' | null = null;
      if (groupAdded.length === 1 && groupRemoved.length === 0) {
        touchedId = groupAdded[0];
        touchedAction = 'added';
      } else if (groupRemoved.length === 1 && groupAdded.length === 0) {
        touchedId = groupRemoved[0];
        touchedAction = 'removed';
      } else {
        const last = findLastEventIdForGroup(groupIds);
        if (last !== null) {
          touchedId = last;
          if (groupAdded.includes(last)) touchedAction = 'added';
          else if (groupRemoved.includes(last)) touchedAction = 'removed';
        }
      }

      if (touchedId !== null && touchedAction !== null) {
        const touchedMenu = groupMenus.find((m: any) => Number(m.Id) === Number(touchedId));
        if (touchedMenu) {
          const isParent = Number(touchedMenu.Parent_Id) === 0;
          if (touchedAction === 'added') {
            if (!isParent) {
              const parent = Number(touchedMenu.Parent_Id);
              if (parent && !groupRemovedSet.has(parent) && !isRecentlyRemoved(parent)) groupDesired.add(parent);
            }
            if (isParent) {
              const children = groupMenus
                .filter((m: any) => Number(m.Parent_Id) === Number(touchedId) && m.IsActive)
                .sort((a: any, b: any) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));
              if (children.length > 0) {
                const anyChildSelected = children.some((c: any) => groupDesired.has(Number(c.Id)));
                if (!anyChildSelected) {
                  const candidate = children
                    .map((c: any) => Number(c.Id))
                    .find((cid) => !groupRemovedSet.has(cid) && !isRecentlyRemoved(cid));
                  if (candidate !== undefined) groupDesired.add(candidate);
                }
              }
            }
          }
          if (touchedAction === 'removed') {
            if (isParent) {
              const children = groupMenus.filter((m: any) => Number(m.Parent_Id) === Number(touchedId));
              for (const c of children) groupDesired.delete(Number(c.Id));
              groupDesired.delete(Number(touchedId));
            } else {
              groupDesired.delete(Number(touchedId));
              const parent = Number(touchedMenu.Parent_Id);
              if (parent) {
                const siblings = groupMenus.filter((m: any) => Number(m.Parent_Id) === parent && m.IsActive);
                const anySiblingSelected = siblings.some((s: any) => groupDesired.has(Number(s.Id)));
                if (!anySiblingSelected) groupDesired.delete(parent);
              }
            }
          }
        }
      }

      for (const id of groupAdded) {
        if (touchedId !== null && id === touchedId) continue;
        if (groupRemovedSet.has(id)) continue;
        if (isRecentlyRemoved(id)) continue;
        const menu = groupMenus.find((m: any) => Number(m.Id) === Number(id));
        if (!menu) continue;
        const isParent = Number(menu.Parent_Id) === 0;
        if (!isParent) {
          const parent = Number(menu.Parent_Id);
          if (parent && !groupRemovedSet.has(parent) && !isRecentlyRemoved(parent)) groupDesired.add(parent);
        }
      }

      for (const id of groupRemoved) {
        if (touchedId !== null && id === touchedId) continue;
        const menu = groupMenus.find((m: any) => Number(m.Id) === Number(id));
        if (!menu) {
          groupDesired.delete(Number(id));
          continue;
        }
        const isParent = Number(menu.Parent_Id) === 0;
        if (isParent) {
          const children = groupMenus.filter((m: any) => Number(m.Parent_Id) === Number(id));
          for (const c of children) groupDesired.delete(Number(c.Id));
          groupDesired.delete(Number(id));
        } else {
          groupDesired.delete(Number(id));
          const parent = Number(menu.Parent_Id);
          if (parent) {
            const siblings = groupMenus.filter((m: any) => Number(m.Parent_Id) === parent && m.IsActive);
            const anySiblingSelected = siblings.some((s: any) => groupDesired.has(Number(s.Id)));
            if (!anySiblingSelected) groupDesired.delete(parent);
          }
        }
      }

      for (const gm of groupMenus) {
        if (Number(gm.Parent_Id) === 0) continue;
        const parent = Number(gm.Parent_Id);
        if (!groupDesired.has(parent)) groupDesired.delete(Number(gm.Id));
      }

      for (const id of groupDesired) {
        if (!isRecentlyRemoved(id)) globalDesired.add(Number(id));
      }
    }

    for (const id of newNums) {
      if (!menuList.some((m: any) => Number(m.Id) === Number(id))) globalDesired.add(Number(id));
    }

    for (const m of menuList) {
      if (Number(m.Parent_Id) === 0) continue;
      const parent = Number(m.Parent_Id);
      if (!globalDesired.has(parent)) globalDesired.delete(Number(m.Id));
    }

    const finalSelected = Array.from(globalDesired.values()).map((n) => Number(n));
    this.RolesService.RolesData.menus = finalSelected;
    this.AddMenubackup = this.RolesService.RolesData.menus;
    this.enforceMultiSelectValue(finalSelected, true);
  }
}
